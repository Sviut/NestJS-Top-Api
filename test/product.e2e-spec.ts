import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
// @ts-ignore
import { Types, disconnect } from 'mongoose'
import { AuthDto } from '../src/auth/dto/auth.dto'
import { CreateProductDto } from '../src/product/dto/create-product.dto'
import { PRODUCT_NOT_FOUND } from '../src/product/product.constants'

const loginDto: AuthDto = {
  login: 'a@a.1',
  password: '1',
}

const testDto: CreateProductDto = {
  advantages: 'Преимущества продукта',
  categories: ['тест'],
  description: 'Описание проукта',
  characteristics: [
    {
      name: 'Характеристика 1',
      value: '1',
    },
    {
      name: 'Характеристика 2',
      value: '2',
    },
  ],
  credit: 10,
  disAdvantages: 'Недостатки продукта',
  image: '2.png',
  price: 100,
  title: 'Мой продукт',
  tags: ['тег1'],
  oldPrice: 120,
}

describe('ProductController (e2e)', () => {
  let app: INestApplication
  let createdId: string
  let token: string

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
    token = body.access_token
  })

  it('/product/create (POST) - success', async (done) => {
    return request(app.getHttpServer())
      .post('/product/create')
      .set('Authorization', 'Bearer ' + token)
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id
        expect(createdId).toBeDefined()
        done()
      })
  })

  it('/product/create (POST) - fail', () => {
    return request(app.getHttpServer())
      .post('/product/create')
      .set('Authorization', 'Bearer ' + token)
      .send({
        title: '',
        price: 0,
      })
      .expect(400)
  })

  it('/product/:id (GET) - success', async (done) => {
    return request(app.getHttpServer())
      .get('/product/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body._id).toBe(createdId)
        done()
      })
  })

  it('/product/:id (GET) - fail', async (done) => {
    return request(app.getHttpServer())
      .get('/product/' + new Types.ObjectId().toHexString())
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        statusCode: 404,
        message: PRODUCT_NOT_FOUND,
        error: 'Not Found',
      })
      .then(() => done())
  })

  it('/product/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/product/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  })

  it('/product/:id (DELETE) - fail', () => {
    return request(app.getHttpServer())
      .delete('/product/' + new Types.ObjectId().toHexString())
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        statusCode: 404,
        message: PRODUCT_NOT_FOUND,
        error: 'Not Found',
      })
  })

  afterAll(() => {
    disconnect()
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { disconnect } from 'mongoose'
import { AuthDto } from '../src/auth/dto/auth.dto'

const loginDto: AuthDto = {
  login: 'a@a.1',
  password: '1',
}

describe('AuthController (e2e)', () => {
  let app: INestApplication
  let createdId: string
  let token: string

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/auth/login (POST) - success', async (done) => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined()
        done()
      })
  })

  it('/auth/login (POST) - password fail', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        ...loginDto,
        password: 'wrongPassword',
      })
      .expect(401, {
        statusCode: 401,
        message: 'Неверный пароль',
        error: 'Unauthorized',
      })
  })

  it('/auth/login (POST) - login fail', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        ...loginDto,
        login: 'wrongLogin@a.ru',
      })
      .expect(401, {
        statusCode: 401,
        message: 'Пользователь с таким email не найден',
        error: 'Unauthorized',
      })
  })

  afterAll(() => {
    disconnect()
  })
})

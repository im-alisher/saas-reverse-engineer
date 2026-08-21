import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { PrismaService } from '../src/prisma/prisma.service'

describe('Analyses (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        analysis: {
          findMany: jest.fn().mockResolvedValue([]),
          count: jest.fn().mockResolvedValue(0),
          findUnique: jest.fn().mockResolvedValue(null),
          delete: jest.fn(),
          create: jest.fn(),
        },
      })
      .compile()

    app = moduleFixture.createNestApplication()
    app.setGlobalPrefix('api/v1')
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    )
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /api/v1/analyses', () => {
    it('should reject invalid URLs', () => {
      return request(app.getHttpServer())
        .post('/api/v1/analyses')
        .send({ url: 'not-a-url' })
        .expect(400)
    })

    it('should reject empty body', () => {
      return request(app.getHttpServer())
        .post('/api/v1/analyses')
        .send({})
        .expect(400)
    })

    it('should reject non-whitelisted fields', () => {
      return request(app.getHttpServer())
        .post('/api/v1/analyses')
        .send({ url: 'https://example.com', extra: 'field' })
        .expect(400)
    })
  })

  describe('GET /api/v1/analyses', () => {
    it('should return paginated results', () => {
      return request(app.getHttpServer())
        .get('/api/v1/analyses')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data')
          expect(res.body).toHaveProperty('meta')
          expect(Array.isArray(res.body.data)).toBe(true)
        })
    })
  })

  describe('GET /api/v1/analyses/:id', () => {
    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .get('/api/v1/analyses/nonexistent')
        .expect(404)
    })
  })

  describe('DELETE /api/v1/analyses/:id', () => {
    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/analyses/nonexistent')
        .expect(404)
    })
  })
})

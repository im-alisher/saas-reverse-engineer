import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule)

  app.enableShutdownHooks()

  app.setGlobalPrefix('api/v1')

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.use((req, _res, next) => {
    logger.log(`${req.method} ${req.url}`)
    next()
  })

  const port = process.env.PORT || 3000
  await app.listen(port)
  logger.log(`Application running on port ${port}`)
}
bootstrap()

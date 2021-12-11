import supertest, * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/service/prisma.service';
import { DemoController } from '../src/module/demo/demo.controller';
import { DemoService } from '../src/module/demo/demo.service';
import { mockDeep } from 'jest-mock-extended'
import { Demo } from '.prisma/client';
import { INestApplication } from '@nestjs/common';


describe("DemoController", () => {

    let app: INestApplication;
    var demoModuleRef : TestingModule;
    let demoController: DemoController;
    let demoService: DemoService;
    let prismaService;

    beforeAll(async () => {
        prismaService = mockDeep<PrismaService>();

        // define a Nest custom value provider: https://docs.nestjs.com/fundamentals/custom-providers
        let PrismaServiceProvider = {
            provide: PrismaService,
            useValue: prismaService
          };

        demoModuleRef = await Test.createTestingModule({
            controllers: [DemoController],
            providers: [DemoService, PrismaServiceProvider],
        }).compile();

        app = demoModuleRef.createNestApplication();
        await app.init();
    });

    beforeEach(async () => {
        demoService = demoModuleRef.get<DemoService>(DemoService);
        prismaService = demoModuleRef.get<PrismaService>(PrismaService);
        demoController = demoModuleRef.get<DemoController>(DemoController)
    });

    it(`/GET demos`, () => {

        const demo: Demo = {
            id: 1,
            name: "Tesst Record",
            deleted: false,
            description: "test demo record",
            createdAt: new Date(),
            updatedAt: new Date()
          };

        //let result:Demo[] = [demo];
        let data:Array<Demo> = new Array<Demo>();
        data.push(demo);

        prismaService.demo.findMany.mockResolvedValue(data);

        return request(app.getHttpServer())
          .get('/demos')
          .expect(200)
          .expect(res => {
            expect(JSON.parse(res.text)[0]["name"]).toEqual(data[0].name);
          })
          // https://github.com/visionmedia/supertest
    });
    
    afterAll(async () => {
        await app.close();
    });

});
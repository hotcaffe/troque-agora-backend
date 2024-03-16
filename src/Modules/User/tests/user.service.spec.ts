import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { HttpException, NotFoundException } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserAddress } from '../entities/userAddress.entity';
import { UserReview } from '../entities/userReview.entity';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Keycloak } from '../../../Services/keycloak/keycloak';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { join, resolve } from 'path';
import { decode } from 'jsonwebtoken';
import { Notice } from '../../notice/entities/notice.entity';
import { NoticeDetails } from '../../notice/entities/noticeDetails.entity';
import { Proposal } from '../../proposal/entities/proposal.entity';
import { ProposalItem } from '../../proposal/entities/proposalItem.entity';
import { ProposalNotices } from '../../proposal/entities/proposalNotices.entity';
import { Category } from '../../category/entities/category.entity';

describe('UserService', () => {
  let service: UserService;
  let httpService: HttpService;
  let keycloakService: Keycloak;
  let chacheModule: CacheModule;
  let userRepository: Repository<User>
  let userAddressRepository: Repository<UserAddress>
  let userReviewRepository: Repository<UserReview>

  const fakeUser = {
    username: "raphael",
    password: "S3nha_t3st3",
    personalData: {
      vc_nome: "Raphael Fusco",
      in_cpf: 99999999999,
      in_celular: 44999999999,
      in_idade: 22,
      vc_email: "raphaelmockteste@gmail.com",
    },
    address: {
      vc_lougradouro: "Rua X",
      in_numero: 999,
      vc_complemento: "Em frente ao Y",
      vc_bairro: "Centro",
      vc_cidade: "Mandaguari",
      vc_estado: "Paraná"
    }
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule, 
        ConfigModule.forRoot({envFilePath: resolve(__dirname, 'test.env')}), 
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.PG_HOST,
          port: Number(process.env.PG_PORT),
          database: process.env.PG_DATABASE,
          username: process.env.PG_USER,
          password: process.env.PG_PASSWORD,
          entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
          synchronize: true,
          autoLoadEntities: true
        }), 
        TypeOrmModule.forFeature([User, UserAddress, UserReview, Notice, NoticeDetails, Proposal, ProposalItem, ProposalNotices, Category]),
        CacheModule.register()
      ],
      providers: [
        UserService,
        Keycloak
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    keycloakService = module.get<Keycloak>(Keycloak);
    httpService = module.get<HttpService>(HttpService);
    chacheModule = module.get<CacheModule>(CacheModule);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userAddressRepository = module.get<Repository<UserAddress>>(getRepositoryToken(UserAddress));
    userReviewRepository = module.get<Repository<UserReview>>(getRepositoryToken(UserReview));
  });

  afterAll(async () => {
    try {
      await service.remove(fakeUser.username)
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        console.log(error)
        throw error
      };
    }
  })

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(keycloakService).toBeDefined();
    expect(chacheModule).toBeDefined();
    expect(httpService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(userAddressRepository).toBeDefined();
    expect(userReviewRepository).toBeDefined();
    expect(process.env.KEYCLOAK_URL).toBe("http://localhost:8080/")
  })
  
  describe("Login", () => {
    beforeAll(async () => {
      try {
        await service.remove(fakeUser.username)
      } catch (error) {
        if (!(error instanceof NotFoundException)) {
          console.log(error)
          throw error
        };
      }
  
      await expect(service.create({username: fakeUser.username, password: fakeUser.password}, fakeUser.personalData, fakeUser.address)).resolves.not.toThrow()
    })
  
    it('should return invalid username and password on every unsucessfull login', async () => {
      const usernameLogin = ""
      const passwordLogin = ""

      await expect(service.login(usernameLogin, passwordLogin)).resolves.toEqual({access_token: "", refresh_token: ""})
    });

    it('should be possible to login with username and password', async () => {
      const userTokens = await service.login(fakeUser.username, fakeUser.password);
      const [access_token, refresh_token] = [decode(userTokens.access_token), decode(userTokens.refresh_token)] as any;
      expect(access_token?.jti).not.toBe("");
      expect(refresh_token?.jti).not.toBe("");
    })
  })

  describe("Create User", () => {
    afterEach(async () => {
      try {
        await service.remove(fakeUser.username)
      } catch (error) {
        if (!(error instanceof NotFoundException)) {
          console.log(error)
          throw error
        };
      }
    })

    it("shouldn't be possible to create new user without informing username and password", async () => {
      const username = ""
      const password = ""
  
      await expect(service.create({username, password}, fakeUser.personalData, fakeUser.address)).rejects.toBeInstanceOf(HttpException);
  
    })
  
    it("shouldn't be possible to create new user without informing all his personal data", async () => {
      const personalData = {
        vc_nome: "",
        in_cpf: null,
        in_celular: null,
        in_idade: null,
        vc_email: "",

      }
  
      await expect(service.create({username: fakeUser.username, password: fakeUser.password}, personalData, fakeUser.address)).rejects.toBeInstanceOf(HttpException);
  
    })
  
    it("Shouldn't be possible to create new user without informing his address", async () => {
      const address = {
        vc_lougradouro: "",
        in_numero: null,
        vc_complemento: "",
        vc_bairro: "",
        vc_cidade: "",
        vc_estado: ""
      }
  
      await expect(service.create({username: fakeUser.username, password: fakeUser.password}, fakeUser.personalData, address)).rejects.toBeInstanceOf(HttpException);
    })
  
    it("Shouldn't be possible to create a user with a password without numbers", async () => {
      const username = "raphael";
      const password = "Senha_teste";
  
      await expect(service.create({username, password}, fakeUser.personalData, fakeUser.address)).rejects.toBeInstanceOf(HttpException);
    })
  
    it("Shouldn't be possible to create a user with a less then 8 characters password", async () => {
      const username = "raphael";
      const password = "Senha_1";
  
      await expect(service.create({username, password}, fakeUser.personalData, fakeUser.address)).rejects.toBeInstanceOf(HttpException);
    })
  
    it("Shouldn't be possible to create a user with a password without special symbols", async () => {
      const username = "raphael";
      const password = "Senha99teste";
  
      await expect(service.create({username, password}, fakeUser.personalData, fakeUser.address)).rejects.toBeInstanceOf(HttpException);
    })
  
    it("Shouldn't be possible to create a user with a password without capital letter", async () => {
      const username = "raphael";
      const password = "senha99_teste";
  
      await expect(service.create({username, password}, fakeUser.personalData, fakeUser.address)).rejects.toBeInstanceOf(HttpException);
    })
  
    it("Shouldn't be possible to create a user with a less then 6 characters username", async () => {
      const username = "rapha";
      const password = "Senha99_teste";
  
      await expect(service.create({username, password}, fakeUser.personalData, fakeUser.address)).rejects.toBeInstanceOf(HttpException);
    })
  
    it("Shouldn't be possible to create a user with an existent username", async () => {
      await expect(service.create({username: fakeUser.username, password: fakeUser.password}, fakeUser.personalData, fakeUser.address)).resolves.not.toThrow();

      const username2 = "raphael";
      const password2 = "Senha99_teste";
  
      await expect(service.create({username: username2, password: password2}, fakeUser.personalData, fakeUser.address)).rejects.toBeInstanceOf(HttpException)
    })
  })

  describe("Find user", () => {
    beforeAll(async () => {
      try {
        await service.remove(fakeUser.username)
      } catch (error) {
        if (!(error instanceof NotFoundException)) {
          console.log(error)
          throw error
        };
      }
  
      await expect(service.create({username: fakeUser.username, password: fakeUser.password}, fakeUser.personalData, fakeUser.address)).resolves.not.toThrow()
    })

    it("Should return list of users, when listing all users", async () => {
      const result = await service.findAll();
      expect(Array.isArray(result)).toBeTruthy();
      expect(result[0]).toEqual(
        expect.objectContaining({
          id_usuario: expect.any(Number),
          vc_nome: expect.any(String),
          in_cpf: expect.any(String),
          in_celular: expect.any(String),
          in_idade: expect.any(Number),
          vc_email: expect.any(String),
          userAddress: expect.any(Array),
          userReview: expect.any(Object)
        })
      )
    })
  
    it("Should return just one user, when listing one user", async () => {
      const userByUsername = await service.findOneByUsername("raphael");
      expect(userByUsername).toEqual(
        expect.objectContaining({
          id_usuario: expect.any(Number),
          vc_nome: expect.any(String),
          in_cpf: expect.any(String),
          in_celular: expect.any(String),
          in_idade: expect.any(Number),
          vc_email: expect.any(String),
          userAddress: expect.any(Array),
          userReview: expect.any(Object)
        })
      )
      const userById = await service.findOne(userByUsername.id_usuario);
      expect(Array.isArray(userById)).toBeFalsy();
      expect(userById).toEqual(
        expect.objectContaining({
          id_usuario: expect.any(Number),
          vc_nome: expect.any(String),
          in_cpf: expect.any(String),
          in_celular: expect.any(String),
          in_idade: expect.any(Number),
          vc_email: expect.any(String),
          userAddress: expect.any(Array),
          userReview: expect.any(Object)
        })
      )
    })
  })

  // describe("Update User", () => {
  //   it("Should be possible to update user review status", async () => {
  //     service.create({username: fakeUser.username, password: fakeUser.password}, fakeUser.personalData, fakeUser.address)
  //     const [id_usuario, qt_trocasSucedidas, qt_trocasRecebidas, qt_trocasAceitas, qt_trocasRecusadas, qt_trocasEnviadas] = [1, 2, 2, 3, 4, 4]
  //     expect(await service.updateAvaliacaoGeral(id_usuario)).resolves;
  //     expect(await service.updateAvaliacaoGeral(id_usuario)).resolves;
  //     expect(service.findOneByUsername(fakeUser.username)).resolves.toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         qt_trocasSucedidas: 2 + 2,
  //         qt_trocasRecebidas: 2 + 2,
  //         qt_trocasAceitas: 3 + 3,
  //         qt_trocasRecusadas: 4 + 4,
  //         qt_trocasEnviadas: 4 + 4
  //       })
  //     );
  
  //   })
  // })


});

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { HttpException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    expect(service).toBeDefined();
  });

  const username = "raphael";
  const password = "S3nha_t3st3";

  const personalData = {
    name: "Raphael Fusco",
    cpf: 99999999999,
    cellphone: 44999999999,
    age: 22,
    email: "raphaelfusco@gmail.com",
  }

  const address = {
    street: "Rua X",
    number: 999,
    complement: "Em frente ao Y",
    neightborhood: "Centro",
    city: "Mandaguari",
    state: "Paraná"
  }

  it("shouldn't be possible to login without username and password", async () => {
    expect(service.create({username, password}, personalData, address)).resolves

    const usernameLogin = ""
    const passwordLogin = ""

    await expect(service.login({username: usernameLogin, password: passwordLogin})).rejects.toBeInstanceOf(HttpException)
  });

  it('should return invalid username and password on every unsucessfull login', async () => {
    expect(service.create({username, password}, personalData, address)).resolves
    await expect(service.login({username: usernameLogin, password: passwordLogin})).rejects.toBeInstanceOf(HttpException)
  });

  it("shouldn't be possible to create new user without informing username and password", async () => {
    const username = ""
    const password = ""

    await expect(service.create({username, password}, personalData, address)).rejects.toBeInstanceOf(HttpException);

  })

  it("shouldn't be possible to create new user without informing all his personal data", async () => {
    const personalData = {
      name: "",
      cpf: "",
      cellphone: "",
      age: "",
      email: "",
    }

    await expect(service.create({username, password}, personalData, address)).rejects.toBeInstanceOf(HttpException);

  })

  it("Shouldn't be possible to create new user without informing his address", async () => {
    const address = {
      street: "",
      number: "",
      complement: "",
      neightborhood: "",
      city: "",
      state: ""
    }

    await expect(service.create({username, password}, personalData, address)).rejects.toBeInstanceOf(HttpException);
  })

  it("Shouldn't be possible to create a user with a password without numbers", async () => {
    const username = "raphael";
    const password = "Senha_teste";

    await expect(service.create({username, password}, personalData, address)).rejects.toBeInstanceOf(HttpException);
  })

  it("Shouldn't be possible to create a user with a less then 8 characters password", async () => {
    const username = "raphael";
    const password = "Senha_1";

    await expect(service.create({username, password}, personalData, address)).rejects.toBeInstanceOf(HttpException);
  })

  it("Shouldn't be possible to create a user with a password without special symbols", async () => {
    const username = "raphael";
    const password = "Senha99teste";

    await expect(service.create({username, password}, personalData, address)).rejects.toBeInstanceOf(HttpException);
  })

  it("Shouldn't be possible to create a user with a password without capital letter", async () => {
    const username = "raphael";
    const password = "senha99_teste";

    await expect(service.create({username, password}, personalData, address)).rejects.toBeInstanceOf(HttpException);
  })

  it("Shouldn't be possible to create a user with a less then 6 characters username", async () => {
    const username = "rapha";
    const password = "Senha99_teste";

    await expect(service.create({username, password}, personalData, address)).rejects.toBeInstanceOf(HttpException);
  })

  it("Shouldn't be possible to create a user with an existent username", async () => {
    expect(service.create({username, password}, personalData, address)).resolves ;

    const username2 = "raphael";
    const password2 = "Senha99_teste";

    await expect(service.create({username: username2, password: password2}, personalData, address)).rejects.toBeInstanceOf(HttpException)
  })

  it("Should return list of users, when listing all users", async () => {
    const result = await service.findAll();
    expect(Array.isArray(result)).toBeTruthy();
    expect(result[0]).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(Number),
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
    const result = await service.findOne("raphael");
    expect(Array.isArray(result)).toBeFalsy();
    expect(result).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(Number),
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
});

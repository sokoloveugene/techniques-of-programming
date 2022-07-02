export interface IClientService {
  get<R>(params: {
    id: number,
  }): Promise<R>;
  update<R, P = unknown>(params: {
    id: number,
    isPrimary: boolean,
    payload?: P,
  }): Promise<R>;
};

export interface IAddService {
  primary<R, P = unknown>(params: {
    productType: string,
    hasSubproducts: boolean,
    payload?: P,
  }): Promise<R>;
  default<R, P = unknown>(params: {
    productType: string,
    hasSubproducts: boolean,
    payload?: P,
  }): Promise<R>;
};

export interface IProductService {
  delete<R>(params: {
    productId: number,
    productType: string,
  }): Promise<R>;
  add: IAddService,
};

export interface IRootService {
  heartbeat<R>(): Promise<R>;
  client: IClientService,
  product: IProductService,
};
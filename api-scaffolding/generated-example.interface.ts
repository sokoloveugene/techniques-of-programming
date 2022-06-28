export interface IClientService {
  get(params: {
    id: number,
  }): Promise<any>;
  update(params: {
    id: number,
    isPrimary: boolean,
    payload?: any,
  }): Promise<any>;
};

export interface IAddService {
  primary(params: {
    productType: string,
    hasSubproducts: boolean,
    payload?: any,
  }): Promise<any>;
  default(params: {
    productType: string,
    hasSubproducts: boolean,
    payload?: any,
  }): Promise<any>;
};

export interface IProductService {
  delete(params: {
    productId: number,
    productType: string,
  }): Promise<any>;
  add: IAddService,
};

export interface IRootService {
  heartbeat(): Promise<any>;
  client: IClientService,
  product: IProductService,
};
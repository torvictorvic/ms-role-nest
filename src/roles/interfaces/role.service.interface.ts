import { RequestI, ResponseI } from '../../utils/constants.util';

export interface RoleServiceI {
  listAll(params: RequestI): Promise<ResponseI>;
  listAllWithPagination(params: RequestI): Promise<ResponseI>;
  getModuleAccess(params: RequestI): Promise<ResponseI>;
  getItem(params: RequestI): Promise<ResponseI>;
  createItem(params: RequestI): Promise<ResponseI>;
  updateItem(params: RequestI): Promise<ResponseI>;
  deleteItem(params: RequestI): Promise<ResponseI>;
}

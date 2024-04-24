type CategoryItem = {
  id: number;
  name: string;
};
type CategoriesResponse = BaseResponse & {
  data: CategoryItem[];
};

type FileItem = {
  id: number;
  name: string;
  createdAt: string;
};

type BaseResponse = {
  error: boolean;
  message: string;
};

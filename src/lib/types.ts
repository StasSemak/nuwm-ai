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
  categories: CategoryItem[];
};

type BaseResponse = {
  error: boolean;
  message: string;
};

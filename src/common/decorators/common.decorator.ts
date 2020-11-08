import { applyDecorators, Query } from "@nestjs/common";
import { ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiProperty, ApiQuery, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { QueryGetPipe } from "../pipe/query-get.pipe";

export const ApiPropertyFile = () => ApiProperty({
    type: "string",
    format: "binary",
    required: false,
});

export const ApiQueryCond = () => ApiQuery({
    name: "cond",
    required: false,
    description: "Điều kiện tìm kiếm theo MongoDB",
});

export const ApiQuerySelect = () => ApiQuery({
    name: "select",
    required: false,
    description: "Danh sách các trường thông tin trả về</p>2 loại:<ul><li>Inclusive</li><li>Exclusive</li></ul><i>Không dùng kết hợp 2 loại</i></p>",
    examples: {
        Default: { value: "" },
        Inclusive: { value: "_id createdAt updatedAt" },
        Exclusive: { value: "-createdAt -updatedAt" },
    },
});

export const ApiQueryPagination = () => applyDecorators(
    ApiQuery({
        name: "page",
        required: false,
        examples: {
            Empty: {},
            Default: { value: 1 },
        },
    }),
    ApiQuery({
        name: "limit",
        required: false,
        examples: {
            Empty: {},
            Default: { value: 20 },
        },
    }),
);

export const ApiQuerySort = () => applyDecorators(
    ApiQuery({
        name: "sort",
        required: false,
        description: "Danh sách các trường thông tin được sắp xếp<p>Sắp xếp theo trường thứ 1 trước, sau đó đến trường thứ 2, 3,...</p>",
        examples: {
            "Empty": {},
            "Example 1": { value: "_id createdAt updatedAt" },
            "Default": { value: "updatedAt" },
        },
    }),
    ApiQuery({
        name: "order",
        required: false,
        description: "Thứ tự sắp xếp tương ứng của các trường sắp xếp<p><ul><li>-1: Giảm dần</li><li>1: Tăng dần</li></ul></p>",
        examples: {
            "Empty": {},
            "Example 1": { value: "-1 1 -1" },
            "Default": { value: "-1" },
        },
    }),
);

export const ApiQueryCustom = () => ApiQuery({
    name: "custom",
    required: false,
    description: "Để các giá trị truy vấn mặc định hoặc tùy chọn<p><ul><li>0 | <i>empty</i> (mặc định): Theo giá trị mặc định</li><li>1: Theo giá trị tùy chọn",
});

export const ApiQueryGetMany = () => applyDecorators(
    ApiQueryCustom(),
    ApiQueryCond(),
    ApiQuerySelect(),
    ApiQuerySort(),
    ApiQueryPagination(),
);

export const ApiQueryGetManyNoCond = () => applyDecorators(
    ApiQueryCustom(),
    ApiQueryCond(),
    ApiQuerySelect(),
    ApiQuerySort(),
    ApiQueryPagination(),
);

export const QueryGet = () => Query(QueryGetPipe);

export const ApiCommonErrors = () => applyDecorators(
    ApiUnauthorizedResponse({
        description: `Thông tin xác thực không chính xác (thông tin đăng nhập hoặc JWT). <a href=/error-example/unauthorized target=_blank style="text-decoration:none"> Ví dụ</a>`,
    }),
    ApiForbiddenResponse({
        description: `Người dùng không được cấp quyền truy cập nguồn nội dung. <a href=/error-example/forbidden target=_blank style="text-decoration:none"> Ví dụ</a>`,
    }),
    ApiInternalServerErrorResponse({
        description: `Lỗi hệ thống. <a href=/error-example/internal-server-error target=_blank style="text-decoration:none"> Ví dụ</a>`,
    }),
);

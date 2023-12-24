<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Description

A NestJS source for fast creating CRUD modules. Using OOP to reuse inheritable classes

## Installation

```bash
$ yarn install
```

## Config environment
```bash
$ cp .env.example .env.development
```

```bash
NODE_ENV=development | production | test
PORT= App Port
DB_HOST= Database Host
DB_PORT= Database Port
DB_USERNAME= Database Username
DB_PASSWORD= Database Password
DB_NAME= Database Name
REDIS_HOST= Redis Host
REDIS_PORT= Redis Port
REDIS_DB= Redis DB
REDIS_PASSWORD= Redis Password
SECRET_JWT= What ever
SECRET_KEY= What ever
SECRET_KEY_IV= What ever
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
## Generate CRUD Module
I have customized @nestjs/schematics that will generate follow my own template.
```bash
$ nest g res module-name
```
Choose Restful and Yes when be asked for CRUD
 // "prepare": "patch-package && husky install"
## Structure
This is my customized template
```bash
module-name
├── controllers
├── dto
├── entities
├── services
└── test
```

## Git convention
My project's convention follow on Angular git convention
Service 1: Product Service

Bảng liên quan: Product_Category, Product, Attribute_Product
Chức năng: Quản lý danh mục sản phẩm, thông tin sản phẩm và thuộc tính sản phẩm.
Database: Bạn có thể tạo một database riêng cho dịch vụ này, chứa các bảng Product_Category, Product và Attribute_Product.
Các API cơ bản:
Lấy danh sách danh mục sản phẩm
Lấy thông tin chi tiết sản phẩm theo ID
Tạo sản phẩm mới
Cập nhật thông tin sản phẩm
Xóa sản phẩm
Service 2: Order Service

Bảng liên quan: Shopping_Session, Cart_Item, Order_Items, Payment_Details, Order_Details
Chức năng: Quản lý quá trình đặt hàng và thanh toán.
Database: Bạn có thể tạo một database riêng cho dịch vụ này, chứa các bảng Shopping_Session, Cart_Item, Order_Items, Payment_Details và Order_Details.
Các API cơ bản:
Tạo phiên mua sắm mới
Thêm sản phẩm vào giỏ hàng
Lấy thông tin giỏ hàng
Đặt hàng
Thanh toán đơn hàng
Lấy danh sách đơn hàng
Điều này chỉ là một gợi ý ban đầu và bạn có thể điều chỉnh phạm vi và chức năng của từng dịch vụ dựa trên yêu cầu cụ thể của ứng dụng của bạn.
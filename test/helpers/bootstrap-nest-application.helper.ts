import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { appCreate } from '../../app.create';
import { AppModule } from '../../src/app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Khởi tạo và thiết lập một instance của ứng dụng NestJS cho mục đích kiểm thử (testing).
 *
 * Hàm này thực hiện các bước sau:
 * 1.  **Tạo Module Kiểm Thử**: Sử dụng `Test.createTestingModule` để tạo một module đặc biệt cho việc kiểm thử.
 *     -   `imports: [AppModule, ConfigModule]`: Import `AppModule` và `ConfigModule` vào module kiểm thử. Điều này cho phép module kiểm thử truy cập và sử dụng các thành phần (providers, controllers, v.v.) đã được định nghĩa trong `AppModule` và `ConfigModule`.
 *     -   `providers: [ConfigService]`: Cung cấp `ConfigService` một cách tường minh trong module kiểm thử. Điều này có thể dùng để ghi đè (override) `ConfigService` gốc hoặc đảm bảo `ConfigService` luôn sẵn có cho các test case.
 * 2.  **Biên Dịch Module**: Gọi `.compile()` để biên dịch module kiểm thử. Quá trình này giải quyết các dependency và chuẩn bị module để có thể tạo instance.
 * 3.  **Tạo Instance Ứng Dụng**: `moduleFixture.createNestApplication()` tạo ra một instance của ứng dụng Nest (kiểu `INestApplication`) từ module kiểm thử đã biên dịch.
 * 4.  **Cấu Hình Thêm (Tùy Chỉnh)**: `appCreate(app)` là một lệnh gọi hàm (được giả định là đã định nghĩa ở một nơi khác). Hàm này có thể thực hiện các bước thiết lập hoặc cấu hình bổ sung cho instance `app` vừa tạo.
 * 5.  **Khởi Tạo Ứng Dụng**: `await app.init()` khởi tạo hoàn chỉnh ứng dụng Nest. Bước này bao gồm việc chạy các lifecycle hooks (ví dụ: `OnModuleInit`), và chuẩn bị ứng dụng sẵn sàng hoạt động.
 *
 * @returns Một `Promise` sẽ giải quyết (resolve) thành một instance `INestApplication` đã được khởi tạo hoàn chỉnh, sẵn sàng để sử dụng trong các kịch bản kiểm thử.
 */
export async function bootstrapNestApplication(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, ConfigModule],
    providers: [ConfigService],
  }).compile();

  const app = moduleFixture.createNestApplication();
  appCreate(app);
  await app.init();
  return app;
}

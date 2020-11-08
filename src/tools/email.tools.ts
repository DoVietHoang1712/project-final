import { SERVER_ADDRESS } from "../config/secrets";
import { User } from "../modules/users/users.schema";
import moment = require("moment");

export class EmailTool {
    static activeRegister(user: User, token: string): string {
        const {
            hoTen,
            username,
        } = user;
        return `<div style="text-align: justify; font-family: Helvetica; color: #404040;margin: 0 80px 0 80px; padding: 40 80 40 80; width:500px">
        <h3>Thông tin tài khoản:</h3>
        <ul style="text-align: left">
           <li>Họ tên: ${hoTen}</li>
           <li>Tên đăng nhập vào hệ thống: ${username}</li>
        </ul>
        <p>Mời bạn bấm nút <strong>Kích hoạt</strong> để kích hoạt tài khoản đăng ký.</p>
        <p>Sau <strong>12 giờ</strong> nếu không kích hoạt, tài khoản sẽ tự động bị xoá.</p>
        <center>
        <a href="${SERVER_ADDRESS}:3020/verify/register/${token}" target="_blank" style="color: #000;padding: 16px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 10px;cursor: pointer;background-color: #99ff99"><b>Kích hoạt</b></a>
        </center>
        </div>`;
    }

    static validateEmail(hoTen: string, username: string, token: string): string {
        return `<div style="text-align: justify; font-family: Helvetica; color: #404040;margin: 0 80px 0 80px; padding: 40 80 40 80; width:500px">
        <h3>Thông tin tài khoản:</h3>
        <ul style="text-align: left">
           <li>Họ tên: ${hoTen}</li>
           <li>Tên đăng nhập vào hệ thống: ${username}</li>
        </ul>
        <p>Mời bạn bấm nút <strong>Xác thực</strong> để xác thực địa chỉ email:</p>
        <center>
        <a href="${SERVER_ADDRESS}:3020/verify/email/${token}" target="_blank" style="color: #000;padding: 16px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 10px;cursor: pointer;background-color: #99ff99"><b>Xác thực</b></a>
        </center>
        </div>`;
    }

    static resetPasswordEmail(name: string, username: string, token: string): string {
        return `<div style="text-align: justify; font-family: Helvetica; color: #404040;margin: 0 80px 0 80px; padding: 40 80 40 80; width:500px">
            <h3>Xin chào ${name}</h3>
            <p>Gần đây bạn đã yêu cầu thay đổi lại mật khẩu cho tài khoản: ${username}.</p>
            <p>Nếu đó là yêu cầu của bạn, hãy sử dụng mật khẩu tạm thời sau để đăng nhập vào tài khoản:</p> <h3>${token}</h3>
            <p>Mật khẩu này có hiệu lực trong vòng 5 ngày.</p>
            <p>Nếu đây không phải là yêu cầu của bạn, bạn có thể bỏ qua email này.</p>
        </div>`;
    }
}

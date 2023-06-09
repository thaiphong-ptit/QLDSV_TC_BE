const sql = require("mssql/msnodesqlv8");
var config = require("../config/db.config");

exports.layDsPhanManh = async (req, res, next) => {
  try {
    let connection = await sql.connect(
      config("sa", "123", "DESKTOP-P12J8O0\\PHONG")
    );
    let dsPhanManh = await connection
      .request()
      .query("SELECT TOP 1000 TENCN, TENSERVER FROM Get_Subscribes");
    res.status(200).send({ data: dsPhanManh.recordset });
    await connection.close();
  } catch (error) {
    console.log(error);
  }
};

exports.dangNhap = async (req, res, next) => {
  try {
    let connection = await sql.connect(
      config(req.body.user, req.body.password, req.body.chiNhanh)
    );
    let thongTin = await connection
      .request()
      .input("TENLOGIN", sql.NVarChar, req.body.user)
      .execute("SP_Lay_Thong_Tin_NV_Tu_login");
    res.status(200).send({ data: thongTin.recordset[0] });
    await connection.close();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Tài khoảng hoặc mật khẩu không đúng!" });
  }
};

exports.dangNhapSV = async (req, res, next) => {
  try {
    let connection = await sql.connect(
      config(req.body.user, req.body.password, req.body.chiNhanh)
    );
    let thongTin = await connection
      .request()
      .input("MASV", sql.NVarChar, req.body.maSV)
      .query(
        `SELECT MASV, HOTEN = ( HO+ ' '+ TEN), PHAI, DIACHI, NGAYSINH, MALOP, DANGHIHOC FROM SINHVIEN WHERE MASV = @MASV`
      );
    if (thongTin.recordset[0]) {
      res.status(200).send({ data: thongTin.recordset[0] });
    } else {
      res.status(500).send({ error: "Không tìm thấy mã Sinh viên!" });
    }
    await connection.close();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Không tìm thấy mã Sinh viên!" });
  }
};

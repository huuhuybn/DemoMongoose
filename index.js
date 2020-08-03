var express = require('express');
var app = express();

var multer = require('multer');

var bodyParser = require('body-parser');
// thiết lập cho express sử dụng thư viện
// bodyParser để lấy dữ liệu từ form
app.use(bodyParser.urlencoded({
    extended: false
}));

var mongoDB = 'mongodb+srv://admin:J0yU3QlbxtKtExMh@cluster0.zwtsu.mongodb.net/test';

var db = require('mongoose');
var Schema = db.Schema;

db.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


console.log('ket noi mongoDB thanh cong!!!!!');


var storageConfig = multer.diskStorage({
    // thuộc tính quy định thư mục chứa file được tải lên
    destination: function (req, res, callback) {
        callback(null, './uploads');
    },
    // thuộc tính quy định tên file đc lưa trong thư mục
    // tên file được lưu sẽ giống với tên gốc của file file.originalname
    filename: function (req, file, callback) {
        var d = new Date();
        var n = d.getTime();
        callback(null, n + file.originalname);
    }
})

var upload = multer({storage: storageConfig});

app.listen(3000);

// khoi tao handlerbar
var handlebars = require('express-handlebars');
app.engine('.hbs', handlebars({
    extname: "hbs",
    defaultLayout: false,
    layoutsDir: "views"
}));

app.set('view engine', '.hbs');


// ten model
var model = 'student';
// ten model va khoi tao cac thuoc tinh
// schema la bien dc khoi tao sau cau lenh require mongoose phia tren
var sinhVien = new Schema({
    name: String,
    number : Number,
    address : String,
});
app.get('/them', (req, res) => {

    var them = db.model(model,sinhVien,'students');

    var kq = them({
        name: 'Huy Nguyen',
        number : '0913360468',
        address : 'Thi Tran Lim, Tien Du , Bac Ninh',
    }).save(function (err){
        if (err == null)
        res.send('Luu thanh cong, kiem tra DB');
        else res.send('Ko thanh cong : ' + err.message);
    })

});

app.get('/sua', (req, res) => {
    var id_can_sua = '5f27602bdf823f044439e356';
    var sua = db.model(model,sinhVien,'students');
    var kq = sua.updateOne({_id : id_can_sua},{
        name: 'Quynh Nguyen',
        number : '111111111',
    }, function (err) {
        res.send('Sua thanh cong, kiem tra lai DB');
    });


});

app.get('/xoa', (req, res) => {

    var id_can_sua = '5f27602bdf823f044439e356';
    var sua = db.model(model,sinhVien,'students');
    var kq = sua.deleteOne({_id : id_can_sua},function (err) {
        res.send('Xoa thanh cong, kiem tra lai DB');


    })

});

app.get('/danhsach', (req, res) => {
    var danhsach = db.model(model,sinhVien,'students');

    var kq = danhsach.find({},function (err, data) {
        res.render('home',{duLieu : data})
    }).lean();

});

app.post('/upload', upload.single('avatar')
    , (req,
       res) => {
        var username = req.body.username;
        var password = req.body.password;

        res.send('upload thanh cong!!!! va hello :' +
            username + ' -  ' + password);
    });

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/home', (req, res) => {
    res.render('index');
});

app.get('/tintuc', (req, res) => {
    res.send('Day la trang tin tuc')
});


import FruitTea from "./assets/FruitTea.png";
import Coffee from "./assets/Coffee.png";
import FruitJuice from "./assets/FruitTea.png";
import MilkTea from "./assets/MilkTea.png";
import CrushedIce from "./assets/Iced.png";
import Yogurt from "./assets/Yogurt.png";
import Topping from "./assets/Topping.png";
import Snack from "./assets/Foods.png";

export const categories = [
    {
        id: 1,
        name: "Trà trái cây",
        path: "fruit-tea",
        image: FruitTea,
        bg: "bg-pink-200"
    },
    {
        id: 2,
        name: "Cà phê",
        path: "coffee",
        image: Coffee,
        bg: "bg-yellow-200"
    },
    {
        id: 3,
        name: "Nước ép",
        path: "fruit-juice",
        image: FruitJuice,
        bg: "bg-green-200"
    },
    {
        id: 4,
        name: "Trà sữa",
        path: "milk-tea",
        image: MilkTea,
        bg: "bg-purple-200"
    },
    {
        id: 5,
        name: "Đồ đá xay đặc biệt",
        path: "crushed-ice",
        image: CrushedIce,
        bg: "bg-blue-200"
    },
    {
        id: 6,
        name: "Sữa chua",
        path: "yogurt",
        image: Yogurt,
        bg: "bg-rose-200"
    },
    {
        id: 7,
        name: "Topping",
        path: "topping",
        image: Topping,
        bg: "bg-orange-200"
    },
    {
        id: 8,
        name: "Món ăn vặt",
        path: "snack",
        image: Snack,
        bg: "bg-lime-200"
    },
]

export const hanoiDistricts = {
    "Ba Đình": [
        'Trúc Bạch', 'Kim Mã', 'Đội Cấn', 'Cống Vị', 'Giảng Võ', 'Liễu Giai', 'Ngọc Hà', 'Thành Công', 'Ngọc Khánh', 'Vĩnh Phúc', 'Nguyễn Trung Trực', 'Phúc Xá', 'Điện Biên', 
        'Quán Thánh'],
    "Cầu Giấy": ['Mai Dịch', 'Dịch Vọng', 'Dịch Vọng Hậu', 'Nghĩa Đô', 'Nghĩa Tân', 'Quan Hoa', 'Trung Hòa', 'Yên Hòa'],
    "Đống Đa": [
        'Cát Linh', 'Hàng Bột', 'Khâm Thiên', 'Khương Thượng', 'Kim Liên', 'Láng Hạ', 'Láng Thượng', 'Nam Đồng', 'Ngã Tư Sở', 'Ô Chợ Dừa', 'Phương Liên', 'Phương Mai', 'Quang Trung', 
        'Quốc Tử Giám', 'Thịnh Quang', 'Thổ Quan', 'Trung Liệt', 'Trung Phụng', 'Trung Tự', 'Văn Chương', 'Văn Miếu'],
    "Hai Bà Trưng": [
        'Bạch Đằng', 'Bách Khoa', 'Bạch Mai', 'Đồng Nhân', 'Đồng Tâm', 'Lê Đại Hành', 'Minh Khai', 'Nguyễn Du', 
        'Phạm Đình Hổ', 'Phố Huế', 'Quỳnh Mai', 'Thanh Lương', 'Thanh Nhàn', 'Trương Định', 'Vĩnh Tuy'],
    "Hoàn Kiếm": [
        'Chương Dương', 'Cửa Đông', 'Cửa Nam', 'Đồng Xuân', 'Hàng Bạc', 'Hàng Bài', 'Hàng Bồ', 'Hàng Bông', 
        'Hàng Buồm', 'Hàng Đào', 'Hàng Gai', 'Hàng Mã', 'Hàng Trống', 'Lý Thái Tổ', 'Phan Chu Trinh', 
        'Phúc Tân', 'Trần Hưng Đạo', 'Tràng Tiền'
    ],
    "Thanh Xuân": [
        'Hạ Đình', 'Khương Đình', 'Khương Mai', 'Khương Trung', 'Kim Giang', 'Nhân Chính', 'Phương Liệt', 'Thanh Xuân Bắc', 'Thanh Xuân Nam', 'Thanh Xuân Trung', 'Thượng Đình'
    ],
    "Hoàng Mai": ['Định Công', 'Hoàng Liệt', 'Tương Mai', 'Giáp Bát', 'Yên Sở', 'Vĩnh Hưng', 'Lĩnh Nam', 
        'Đại Kim', 'Thịnh Liệt', 'Hoàng Văn Thụ', 'Tân Mai', 'Thanh Trì', 'Trần Phú', 'Mai Động'],
    "Long Biên": ['Thượng Thanh', 'Bồ Đề', 'Long Biên', 'Đức Giang', 'Ngọc Thụy', 'Gia Thụy', 'Ngọc Lâm', 'Phúc Đồng', 'Cự Khối', 
        'Việt Hưng', 'Sài Đồng', 'Phúc Lợi', 'Thạch Bàn', 'Giang Biên'],
    "Hà Đông": ['Biên Giang', 'Đồng Mai', 'Dương Nội', 'Hà Cầu', 'Kiến Hưng', 'La Khê', 'Mộ Lao', 'Phú La', 'Phú Lãm', 'Phú Lương', 
        'Phúc La', 'Quang Trung', 'Vạn Phúc', 'Văn Quán', 'Yên Nghĩa'],
    "Tây Hồ": ['Bưởi', 'Nhật Tân', 'Phú Thượng', 'Quảng An', 'Thụy Khuê', 'Tứ Liên', 'Xuân La', 'Yên Phụ'],
    "Nam Từ Liêm": ['Cầu Diễn', 'Mỹ Đình 1', 'Mỹ Đình 2', 'Phú Đô', 'Mễ Trì', 'Trung Văn', 'Đại Mỗ', 'Tây Mỗ', 'Phương Canh', 'Xuân Phương'],
    "Bắc Từ Liêm": ['Cổ Nhuế 1', 'Cổ Nhuế 2', 'Đức Thắng', 'Đông Ngạc', 'Liên Mạc', 'Minh Khai', 'Phú Diễn', 'Phúc Diễn', 'Tây Tựu', 'Thượng Cát', 'Thụy Phương', 'Xuân Đỉnh', 'Xuân Tảo'],
}
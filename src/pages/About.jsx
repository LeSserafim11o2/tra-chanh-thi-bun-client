import avatar from "../assets/Athinh.jpg";
import family from "../assets/AThinhCungGiaDinh.jpg";
const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-pink-50 dark:bg-black/60 rounded-xl shadow-md mt-10">
      <h1 className="text-4xl font-bold dark:text-pink-400 text-pink-600 mb-6 text-center font-sans">
        🌿 Từ Chảo Lửa Đến Ly Trà Chanh: Câu Chuyện Của Người Cha Mang Tên Con Gái
      </h1>

      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <img src={avatar} alt="Chủ quán Thịnh" className="w-90 h-90 rounded-lg object-cover shadow-lg"/>
          <p className="italic text-black dark:text-white">Anh Thịnh cùng hai con trai của mình</p>
        </div>

        <div className="text-pink-700 dark:text-pink-300 font-sans space-y-2 text-center text-lg">
          <p>
            Chào mừng bạn đến với <span className="font-semibold">Trà Chanh Thị Bún</span> - nơi không chỉ có những ly trà chanh mát lạnh giải khát, mà còn ẩn chứa một câu chuyện đầy cảm 
            hứng về hành trình và đam mê.
          </p>
          <p>
            Hãy cùng chúng tôi khám phá câu chuyện của người thuyền trưởng thầm lặng phía sau thương hiệu thân thuộc này: anh <span className="font-semibold">Nguyễn Quốc Thịnh</span>. 
            Sinh năm 1989, anh Thịnh không phải là một cái tên xa lạ với những người gắn bó cùng hương vị ẩm thực hay những con đường Hà Nội.
          </p>
          <p>
            Suốt 9 năm đứng bếp, anh Thịnh đã rèn giũa đôi tay mình với những ngọn lửa và hương vị, tạo nên không biết bao nhiêu món ăn ngon, làm hài lòng biết bao thực khách khó tính. 
            Tưởng chừng như nghiệp bếp đã định hình con đường của anh, thế nhưng, cuộc đời luôn có những ngã rẽ bất ngờ.
          </p>
          <p>
            Sau đó, anh Thịnh lại bén duyên với những cung đường, cần mẫn cầm lái chiếc taxi Grab suốt 8 năm. Mỗi chuyến đi không chỉ là hành trình đưa đón khách, mà còn là những trải 
            nghiệm, những cuộc gặp gỡ, mở rộng tầm nhìn về cuộc sống hối hả nơi phố thị.
          </p>
          <p>
            Và rồi, từ những trải nghiệm phong phú ấy, từ ngọn lửa đam mê ẩm thực và sự nhạy bén với thị trường, anh Thịnh đã quyết định tạo nên một dấu ấn của riêng mình: Trà Chanh Thị 
            Bún. Cái tên <span className="font-semibold">Thị Bún</span> không chỉ đơn thuần là một thương hiệu; đó là cả một thế giới thu nhỏ của tình yêu thương, sự trân quý dành cho cô 
            con gái bé bỏng của anh. Mỗi ly trà chanh được pha chế tại đây không chỉ mang vị chua, ngọt, thanh mát, mà còn chứa đựng cả tấm lòng của một người cha, mong muốn những điều tốt 
            đẹp nhất cho gia đình và cho những khách hàng yêu quý.
          </p>
          <p>
            Anh <span className="font-semibold">Nguyễn Quốc Thịnh</span> - người đàn ông với trái tim ấm áp, bàn tay tài hoa và tinh thần không ngừng học hỏi, đổi mới - đã mang đến cho bạn 
            không chỉ một thức uống, mà còn là một phần câu chuyện, một trải nghiệm chân thật, giản dị nhưng đầy ý nghĩa.
          </p>
        </div>

        <div className="text-center">
          <img src={family} alt="Anh Thịnh" className="w-screen rounded-2xl h-100 object-cover shadow-lg"/>
          <p className="italic dark:text-white">Anh Thịnh cùng gia đình, bé Thị Bún- con gái được anh bế</p>
        </div>
      </div>
    </div>
  );
};

export default About;

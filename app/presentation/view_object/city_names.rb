# frozen_string_literal: true

module Views
  # View for a single info entity
  class CityNames
    def initialize(city)
      @city = city
    end

    def legal_city?
      citynames_ch = %w[台北 桃園 新竹 苗栗 台中 彰化 雲林 嘉義 南投 台南 高雄 屏東 台東 花蓮 宜蘭 新北
                        澎湖 金門 馬祖]
      citynames_en = ['Hualien', 'Taipei', 'New Taipei', 'Keelung', 'Yilan', 'Hsinchu', 'Taoyuan', 'Taichung',
                      'Miaoli', 'Changhua', 'Nantou', 'Yunlin', 'Chiayi', 'Tainan', 'Kaohsiung', 'Pingtung',
                      'Penghu', 'Yunlin', 'Hualien', 'Taitung', 'Kinmen', 'Matsu']
      citynames_ch.include?(@city) | citynames_en.include?(@city) | citynames_en.map(&:downcase).include?(@city)
    end
  end
end

# frozen_string_literal: true

require_relative '../../helpers/spec_helper'
require_relative '../../helpers/database_helper'
require_relative '../../helpers/vcr_helper'

# require 'headless'
require 'webdrivers/chromedriver'
require 'watir'

describe 'Acceptance Tests' do
  before do
    DatabaseHelper.wipe_database
    # @headless = Headless.new
    @browser = Watir::Browser.new
  end

  after do
    @browser.close
    # @headless.destroy
  end

  describe 'Homepage' do
    describe 'Visit Home page' do
      it '(HAPPY) should not see cafestore list page if not created' do
        # GIVEN: user is on the home page without any searching record
        @browser.goto homepage

        # THEN: user should see basic headers, no projects and a welcome message
        _(@browser.h1(id: 'main_header').text).must_equal 'CafeMap' # layer
        _(@browser.text_field(id: 'region').present?).must_equal true # home
        _(@browser.button(id: 'repo-form-submit').present?).must_equal true
        _(@browser.table(id: 'projects_table').exists?).must_equal false

        _(@browser.div(id: 'flash_bar_success').present?).must_equal true
        _(@browser.div(id: 'flash_bar_success').text.downcase).must_include 'start'
      end
    end

    describe 'Add Region Keyword' do
      it '(HAPPY) should be able to request a Region Keyword' do
        # GIVEN: user is on the home page without entering any keyword
        @browser.goto homepage

        # WHEN: they type a 'city' name in taiwan and submit
        good_city_ch = %w[台北 新北 基隆 宜蘭 新竹 桃園
                          苗栗 彰化 南投 雲林 台中 嘉義 台南 高雄
                          屏東 雲林 花蓮 台東 金門 馬祖]

        good_city_en = ['Hualien', 'Taipei', 'New Taipei', 'Keelung', 'Yilan', 'Hsinchu', 'Taoyuan', 'Taichung',
                        'Miaoli', 'Changhua', 'Nantou', 'Yunlin', 'Chiayi', 'Tainan', 'Kaohsiung', 'Pingtung',
                        'Penghu', 'Yunlin', 'Hualien', 'Taitung', 'Kinmen', 'Matsu']
        condition = good_city_ch.include?(REGION) | good_city_en.include?(REGION) | good_city_en.map(&:downcase).include?(REGION)

        begin
         # raises the exception only if the condition is true
          if condition==true
            valid_city = REGION
          else
            raise StandardError.new 'valid_city is not valid QQ'
          end
        rescue StandardError => e 
             puts e.message
        end



        @browser.text_field(id: 'region').set(valid_city)
        @browser.button(id: 'repo-form-submit').click

        # THEN: they should find the cafeshop with match address on the region's page
        @browser.address.include? REGION
      end
    end
  end
end

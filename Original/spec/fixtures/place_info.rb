# frozen_string_literal: true

require 'yaml'
require 'http'

def location_filter(row_data, attr1, wordterm)
  # Input: Hash (yaml)
  store_keys =  row_data.keys[3..]
  filtered_keys = store_keys.select { |item| row_data[item][attr1] == wordterm }
  # split the "{" and remove the distinct code
  filtered_keys.map { |key| key.split('{')[0] }
end

def data_clean(store_name)
  # Input: string array of cafe name
  store_name.map { |name_str| name_str.gsub('()', '').gsub(' ', '').gsub("\b", '') }
end

def placeapi_token
  config_yaml = YAML.safe_load(File.read('config/secrets.yml'))
  config_yaml['test']['PLACE_TOKEN']
end

def call_placeapi_url(filter_store)
  token = placeapi_token
  HTTP.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=#{filter_store}&key=#{token}&language=zh-TW")
end

def call_placeapi_storename(clean_name, dist)
  # call google place api iterativily
  output = {}
  clean_name.each do |store|
    output[store] = call_placeapi_url(store).parse
  end
  # Save into yaml (make the empty yml file first)
  File.open(dist, 'w') do |f|
    f.puts output.to_yaml
    f.close
  end
end

def limited_ans_sheet_builder(source, dist, limit: true)
  # call & filter
  cafe_raw = YAML.load_file(source)
  filtered_store = location_filter(cafe_raw, 'city', 'hsinchu')

  # Caution We set it for avoid overcharging from placeAPI
  filtered_store = ["WHO'S 喜象 CAFE", 'ARTROOM14藝室', '有隻貓咖啡'] if limit == true
  clean_name = data_clean(filtered_store)
  call_placeapi_storename(clean_name, dist)
end

limited_ans_sheet_builder('spec/fixtures/cafe_results.yml', 'spec/fixtures/place_results.yml', true)

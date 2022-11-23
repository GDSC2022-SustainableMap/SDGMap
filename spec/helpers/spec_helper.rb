# frozen_string_literal: true

ENV['RACK_ENV'] = 'test'

require 'simplecov'
SimpleCov.start

require 'yaml'
require 'minitest/autorun'
require 'minitest/rg'
require 'vcr'
require 'webmock'
require_relative '../../app/domain/cafenomad/mappers/info_mapper'
require_relative '../../config/environment'
require_relative '../../require_app'
require_app

CONFIG = YAML.safe_load(File.read('config/secrets.yml'))

CAFE_TOKEN = CafeMap::App.config.CAFE_TOKEN

CAFE_CORRECT = YAML.safe_load(File.read('spec/fixtures/cafe_results.yml'))
FAKE_TOKEN = 'Fake_api'

## PLACE_API

KEYWORD_FILTER = '新竹'
TOKEN_NAME = 'Place_api'

PLACE_TOKEN = CafeMap::App.config.PLACE_TOKEN

TEST_STORE = ["WHO'S 喜象 CAFE", 'ARTROOM14藝室', '有隻貓咖啡'].freeze

FAKE_TEST_STORE = [''].freeze

PLACE_CORRECT = YAML.safe_load(File.read('spec/fixtures/place_results.yml'))
STORE_CORRECT = PLACE_CORRECT.keys

PLACE_INCORRECT = YAML.safe_load(File.read('spec/fixtures/place_bad_results.yml'))

def ans_sheet(target_attr, data_keys, correct, api_type = 'cafe')
  # Reduce the duplicated code via answer generator based on api_type
  if api_type == 'place'
    data_keys.map { |item| correct[item]['results'][0][target_attr] }
  else
    data_keys.map { |item| correct[item][target_attr] }
  end
end

def homepage
  CafeMap::App.config.APP_HOST
end

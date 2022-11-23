# frozen_string_literal: true

require 'http'
require 'yaml'
require 'json'
require 'net/http'
require 'uri'
require_relative '../../require_app'
require_relative '../../config/environment'

def url_concat(token)
  token
end

def get_full_url(_token_category, _name_of_key)
  # Added the folder 'config/secrets.yml' first
  token = CafeMap::App.config.CAFE_TOKEN
  url_concat(token)
end

def call_cafe_url(url)
  uri = URI.parse(url)
  req = Net::HTTP::Get.new(uri.request_uri)
  https = Net::HTTP.new(uri.host, uri.port)
  https.use_ssl = true
  res = https.request(req)
  JSON.parse(res.body)
end

def json_array_to_yaml(cafe_json)
  store = {}
  store['status'] = 'ok' unless cafe_json.nil?
  store['amount'] = cafe_json.length
  store['header'] = cafe_json[0].keys

  cafe_json.each do |each_store|
    cafe_name = "#{each_store['name']}{#{each_store['id'].split('-')[0]}"
    store[cafe_name] = each_store
  end

  store
end

def answer_sheet_builder(token_category, name_of_key, output_path)
  cafenomad_url = get_full_url(token_category, name_of_key)
  cafe_json = call_cafe_url(cafenomad_url)
  cafe_yaml = json_array_to_yaml(cafe_json)
  File.write(output_path, cafe_yaml.to_yaml)
  cafe_yaml
end

answer_sheet_builder('CAFE_NOMAD', 'Cafe_api', 'spec/fixtures/cafe_results.yml')

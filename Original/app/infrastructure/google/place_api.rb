# frozen_string_literal: true

require 'yaml'
require 'http'

module CafeMap
  module Place
    # Library for Place API
    class PlaceApi
      def initialize(place_token, store_list)
        @place_token = place_token
        @store_list = store_list
      end

      def store_data
        Request.new(@place_token, @store_list).get
      end

      # Sends out HTTP requests to Google Place API
      class Request
        API_PLACE_HOST = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=%s&key=%s&language=zh-TW'
        def initialize(place_token, store_list)
          @place_token = place_token
          @store_list = store_list
        end

        def get
          clean_list = data_clean(@store_list)

          clean_list.map do |store|
            http_response = HTTP.get(format(API_PLACE_HOST, store, @place_token))
            result = Response.new(http_response).tap do |res|
              raise(res.error) unless res.successful?
            end
            result.parse
          end
        end

        def data_clean(box)
          # Input: string array of cafe name
          box.map { |name_str| name_str.gsub('()', '').gsub(' ', '').gsub("\b", '') }
        end
      end

      # Decorates HTTP responses  with success/error reporting
      class Response < SimpleDelegator
        Unauthorized = Class.new(StandardError)
        NotFound = Class.new(StandardError)

        HTTP_ERROR = {
          401 => Unauthorized,
          404 => NotFound
        }.freeze

        def successful?
          HTTP_ERROR.keys.none?(code)
        end

        def error
          HTTP_ERROR[code]
        end
      end
    end
  end
end

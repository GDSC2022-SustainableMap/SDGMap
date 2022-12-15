# frozen_string_literal: true

require 'net/http'
require 'json'

module CafeMap
  module CafeNomad
    class Api # rubocop:disable Style/Documentation
      def initialize(cafe_token)
        @cafe_token = cafe_token
      end

      def status_data
        jarray_temp = Request.new(@cafe_token).get
        jarray_to_yml(jarray_temp)
      end

      def info_data
        Request.new(@cafe_token).get
      end

      private

      def jarray_to_yml(jarray)
        store = {}
        store['status'] = 'ok' unless jarray.nil?
        store['amount'] = jarray.length
        store['header'] = jarray[0].keys

        jarray.each do |each_store|
          cafe_name = "#{each_store['name']}{#{each_store['id'].split('-')[0]}"
          store[cafe_name] = each_store
        end
        store
      end
    end

    class Request # rubocop:disable Style/Documentation
      # token here would be a cafe_api url
      def initialize(cafe_token)
        @cafe_token = cafe_token
      end

      def get
        uri = URI.parse(@cafe_token)
        req = Net::HTTP::Get.new(uri.request_uri)
        https = Net::HTTP.new(uri.host, uri.port)
        https.use_ssl = true
        res = https.request(req)
        JSON.parse(res.body)
      end
    end
  end
end

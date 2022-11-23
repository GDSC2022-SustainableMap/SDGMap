# frozen_string_literal: false

require_relative '../../../infrastructure/cafenomad/cafe_api'
require_relative '../entities/info'
require_relative 'mixin_module'

module CafeMap
  module CafeNomad
    # InfoMapper is the mapper deal with CafeNomad API
    class InfoMapper
      # tokename will be "Cafe_api"
      def initialize(cafe_token, gateway_class = CafeNomad::Api)
        @cafe_token = cafe_token
        @gateway_class = gateway_class
        @gateway = gateway_class.new(@cafe_token)
      end

      def load_several
        @gateway.info_data.map do |each_store|
          InfoMapper.build_entity(each_store)
        end
      end

      def self.build_entity(data)
        DataMapper.new(data).build_entity
      end
    end

    # Map the data comes from gateway into entity
    class DataMapper
      include InfoMixinRank
      include InfoMixinGeo
      def initialize(data)
        @data = data
      end

      def build_entity
        Entity::Info.new(
          infoid:,
          name:,
          city:,
          wifi:,
          seat:,
          quiet:,
          tasty:,
          cheap:,
          music:,
          url:,
          address:,
          latitude:,
          longitude:,
          limited_time:,
          socket:,
          standing_desk:,
          mrt:,
          open_time:
        )
      end
    end
  end
end

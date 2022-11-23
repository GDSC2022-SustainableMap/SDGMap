# frozen_string_literal: false

require_relative '../../../infrastructure/google/place_api'
require_relative '../entities/store'
require_relative 'storemixin'

module CafeMap
  # Provides access to contributor data
  module Place
    # Data Mapper: Place store -> store entity
    class StoreMapper
      def initialize(token, store_list, gateway_class = Place::PlaceApi)
        @token = token
        @store_list = store_list
        @gateway_class = gateway_class
        @gateway = @gateway_class.new(@token, @store_list)
      end

      def bad_request
        @gateway.store_data[0]['status']
      end

      def load_several
        @gateway.store_data.map do |each_store|
          data = each_store['results'][0]
          StoreMapper.build_entity(data)
        end
      end

      def self.build_entity(data)
        DataMapper.new(data).build_entity
      end

      # Extracts entity specific elements from data structure
      class DataMapper
        include StoreMixin
        def initialize(data)
          @data = data
        end

        def build_entity
          CafeMap::Entity::Store.new(
            place_id:,
            name:,
            formatted_address:,
            location_lat:,
            location_lng:,
            rating:,
            user_ratings_total:
          )
        end
      end
    end
  end
end

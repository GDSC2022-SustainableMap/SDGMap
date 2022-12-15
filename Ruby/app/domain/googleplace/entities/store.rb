# frozen_string_literal: false

require 'dry-types'
require 'dry-struct'

module CafeMap
  module Entity
    # Domain entity for stores
    class Store < Dry::Struct
      include Dry.Types

      attribute :place_id, Strict::String # Coercible #Strict
      # attribute :info_id, String.optional
      attribute :name, Strict::String
      attribute :formatted_address, Strict::String
      attribute :location_lat,  Coercible::String
      attribute :location_lng,  Coercible::String
      attribute :rating, Coercible::Float
      attribute :user_ratings_total, Strict::Integer

      def to_attr_hash
        to_hash # except:remove keys from hash
      end
    end
  end
end

# frozen_string_literal: false

require 'dry-struct'
require 'dry-types'
require_relative '../../googleplace/entities/store'

module CafeMap
  module Entity
    # Domain entity for any coding projects
    class Info < Dry::Struct
      include Dry.Types

      attribute :infoid,              Strict::String
      attribute :name,                Strict::String
      attribute :city,                Strict::String
      attribute :wifi,                Nominal::Float
      attribute :seat,                Nominal::Float
      attribute :quiet,               Nominal::Float
      attribute :tasty,               Nominal::Float
      attribute :cheap,               Nominal::Float
      attribute :music,               Nominal::Float
      attribute :url,                 Strict::String
      attribute :address,             Strict::String
      attribute :latitude,            Strict::String
      attribute :longitude,           Strict::String
      attribute :limited_time,        Strict::String
      attribute :socket,              Strict::String
      attribute :standing_desk,       Strict::String
      attribute :mrt,                 Strict::String
      attribute :open_time,           Strict::String

      def to_attr_hash
        to_hash # except:remove keys from hash
      end
    end
  end
end

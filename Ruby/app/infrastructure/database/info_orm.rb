# frozen_string_literal: true

require 'sequel'
require './config/environment'

module CafeMap
  module Database
    # Object Relational Mapper for Project Entities
    class InfoOrm < Sequel::Model(:info)
      one_to_many :store,
                  class: :'CafeMap::Database::StoreOrm',
                  key: :info_id
      plugin :timestamps, update_on_create: true

      def self.find_or_create(store_info)
        first(name: store_info[:name]) || create(store_info)
      end

      def self.wifi(store_info)
        store_info[:wifi].map(&:to_i)
      end
    end
  end
end

# frozen_string_literal: true

require 'sequel'
require './config/environment'

module CafeMap
  module Database
    # Object-Relational Mapper for Members
    class StoreOrm < Sequel::Model(:store)
      many_to_one :info,
                  class: :'CafeMap::Database::InfoOrm'

      plugin :timestamps, update_on_create: true
    end
  end
end

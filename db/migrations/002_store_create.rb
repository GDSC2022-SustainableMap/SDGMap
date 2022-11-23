# frozen_string_literal: true

require 'sequel'

Sequel.migration do
  change do
    create_table(:store) do
      primary_key :id
      foreign_key :info_id, :info

      String      :place_id
      String      :name
      String      :formatted_address
      String      :location_lat
      String      :location_lng
      Float       :rating
      Integer     :user_ratings_total

      DateTime    :created_at
      DateTime    :updated_at
    end
  end
end

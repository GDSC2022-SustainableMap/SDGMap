# frozen_string_literal: true

require 'sequel'

Sequel.migration do
  change do
    create_table(:info) do
      primary_key :id

      String      :infoid
      String      :name
      String      :city
      String      :wifi
      String      :seat
      String      :quiet
      String      :tasty
      String      :cheap
      String      :music
      String      :url
      String      :address
      String      :latitude
      String      :longitude
      String      :limited_time
      String      :socket
      String      :standing_desk
      String      :mrt
      String      :open_time

      DateTime :created_at
      DateTime :updated_at
    end
  end
end

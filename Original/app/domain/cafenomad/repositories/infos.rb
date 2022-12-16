# frozen_string_literal: true

module CafeMap
  module Repository
    # Repository for Info
    class Infos
      def self.find_id(id)
        Database::InfoOrm.first(id:)
      end

      def self.last_id
        Database::InfoOrm.last.id
      end

      def self.find(entity)
        find_name(entity.name)
      end

      def self.find_name(name)
        Database::InfoOrm.first(name:)
      end

      def self.find_all_city
        Database::InfoOrm.all
      end

      def self.all
        Database::InfoOrm.all.map { |each| rebuild_entity(each) }
      end

      def self.all_filtered_name(city)
        Database::InfoOrm.all.select { |each| each.city.include? city }.map(&:name)
      end

      def self.all_filtered(city)
        Database::InfoOrm.all.select { |each| each.city.include? city }
      end

      def self.all_name
        Database::InfoOrm.all.map(&:name)
      end

      def self.wifi
        Database::InfoOrm.all.map(&:wifi)
      end

      # check if the data has already in db
      def self.create(entity)
        return if find(entity)

        db_info = PersistInfo.new(entity).create_info
        rebuild_entity(db_info)
      end

      def self.rebuild_entity(db_record)
        return nil unless db_record

        Entity::Info.new(
          infoid: db_record.infoid,
          name: db_record.name,
          city: db_record.city,
          wifi: db_record.wifi,
          seat: db_record.seat,
          quiet: db_record.quiet,
          tasty: db_record.tasty,
          cheap: db_record.cheap,
          music: db_record.music,
          url: db_record.url,
          address: db_record.address,
          latitude: db_record.latitude,
          longitude: db_record.longitude,
          limited_time: db_record.limited_time,
          socket: db_record.socket,
          standing_desk: db_record.standing_desk,
          mrt: db_record.mrt,
          open_time: db_record.open_time
        )
      end

      def self.rebuild_many(db_records)
        db_records.map do |db_member|
          Infos.rebuild_entity(db_member)
        end
      end

      def self.db_find_or_create(entity)
        Database::InfoOrm.find_or_create(entity.to_attr_hash)
      end
    end

    class PersistInfo
      def initialize(entity)
        @entity = entity
      end

      def create_info
        Database::InfoOrm.create(@entity.to_attr_hash)
      end
    end
  end
end

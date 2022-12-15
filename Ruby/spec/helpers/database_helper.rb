# frozen_string_literal: true

# require '../app/infrastructure/database/info_orm.rb'

# Helper to clean database during test runs
module DatabaseHelper
  # Deliberately :reek:DuplicateMethodCall on App.DB
  def self.wipe_database
    # Ignore foreign key constraints when wiping tables
    CafeMap::App.DB.run('PRAGMA foreign_keys = OFF')
    CafeMap::Database::InfoOrm.map(&:destroy)
    CafeMap::Database::StoreOrm.map(&:destroy)
    CafeMap::App.DB.run('PRAGMA foreign_keys = ON')
  end
end

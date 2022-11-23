# frozen_string_literal: false

require_relative '../../helpers/spec_helper'
require_relative '../../helpers/vcr_helper'
require_relative '../../helpers/database_helper'

describe 'Integration Tests of Cafe API and Database' do
  VcrHelper.setup_vcr

  before do
    VcrHelper.configure_vcr_for_cafe
  end

  after do
    VcrHelper.eject_vcr
  end

  describe 'Retrieve and store info' do
    before do
      DatabaseHelper.wipe_database
    end

    it 'HAPPY: should be able to save Info from CafeNomad to database' do
      info = CafeMap::CafeNomad::InfoMapper.new(CAFE_TOKEN).load_several
      info.each do |each_info|
        rebuilt = Repository::For.entity(info).create(each_info)
        _(rebuilt.infoid).must_equal(each_info.infoid)
        _(rebuilt.name).must_equal(each_info.name)
        _(rebuilt.wifi).must_equal(each_info.wifi)
        _(rebuilt.seat).must_equal(each_info.seat)
        _(rebuilt.quiet).must_equal(each_info.quiet)
        _(rebuilt.tasty).must_equal(each_info.tasty)
        _(rebuilt.cheap).must_equal(each_info.cheap)
        _(rebuilt.music).must_equal(each_info.music)
        _(rebuilt.url).must_equal(each_info.url)
        _(rebuilt.address).must_equal(each_info.address)
        _(rebuilt.latitude).must_equal(each_info.latitude)
        _(rebuilt.longitude).must_equal(each_info.longitude)
        _(rebuilt.limited_time).must_equal(each_info.limited_time)
        _(rebuilt.socket).must_equal(each_info.socket)
        _(rebuilt.standing_desk).must_equal(each_info.standing_desk)
        _(rebuilt.mrt).must_equal(each_info.mrt)
        _(rebuilt.open_time).must_equal(each_info.open_time)
      end
    end
  end
end

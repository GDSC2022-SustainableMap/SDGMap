# frozen_string_literal: true

require_relative '../../helpers/spec_helper'
require_relative '../../helpers/vcr_helper'
require_relative '../../helpers/database_helper'
require_relative '../../../app/domain/googleplace/mappers/store_mapper'

describe 'Tests Place API library' do
  before do
    VcrHelper.configure_vcr_for_place
  end

  after do
    VcrHelper.eject_vcr
  end

  describe 'Store information' do
    before do
      @store = CafeMap::Place::StoreMapper.new(PLACE_TOKEN, TEST_STORE).load_several
      # @yaml_keys = STORE_CORRECT[0..].map { |key| PLACE_CORRECT[key]['results'] }
      @yaml_keys = STORE_CORRECT
    end

    ## First Layer in yaml: Testing

    it 'HAPPY: should provide similar place_id' do
      _(@store.map(&:place_id)).must_equal(ans_sheet('place_id', @yaml_keys, PLACE_CORRECT, 'place'))
    end

    it 'HAPPY: should provide similar rating' do
      _(@store.map(&:rating)).must_equal(ans_sheet('rating', @yaml_keys, PLACE_CORRECT, 'place'))
    end

    it 'HAPPY: should provide similar user_ratings_total' do
      # The actual reviewer quantity will updated on real time.
      _(@store.map(&:user_ratings_total)).must_equal(ans_sheet('user_ratings_total', @yaml_keys, PLACE_CORRECT,
                                                               'place'))
    end

    ## Second  Layer in yaml: Testing for location related info

    it 'HAPPY: should provide similar latitute' do
      _(@store.map(&:location_lat)).must_equal(
        ans_sheet('geometry', @yaml_keys, PLACE_CORRECT, 'place').map do |item|
          item['location']['lat']
        end.map(&:to_s)
      )
    end

    it 'HAPPY: should provide similar longitude' do
      _(@store.map(&:location_lng)).must_equal(
        ans_sheet('geometry', @yaml_keys, PLACE_CORRECT, 'place').map do |item|
          item['location']['lng']
        end.map(&:to_s)
      )
    end

    it 'BAD: should raise exception on incorrect invalid result' do
      bad = CafeMap::Place::StoreMapper.new(PLACE_TOKEN, FAKE_TEST_STORE).bad_request
      _(bad).must_equal PLACE_INCORRECT['INVALID_REQUEST']['status']
    end
  end
end

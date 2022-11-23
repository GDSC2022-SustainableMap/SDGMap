# frozen_string_literal: true

require 'descriptive_statistics'

module Views
  # View for a single info entity
  class StatStores
    def initialize(google_data)
      @google_data = google_data

      @rating_box = []
      @google_data.each { |obj| obj.each { |each_store| @rating_box.append(each_store.rating) } }
    end

    def entity
      @google_data
    end

    attr_reader :rating_box

    def std_rating_box
      @rating_box.map { |rating| (rating - mean) / standard_deviation }
    end

    def mean
      @rating_box.mean
    end

    def standard_deviation
      @rating_box.standard_deviation
    end

    def variance
      @rating_box.variance
    end

    def scaling_parameter
      return 'The store quantity is too limited to create unbaised normailzaed rating' unless @rating_box.length >= 2

      # min, max = std_rating_box().minmax
      min, max = rating_box.minmax

      min_range = 1.0 - min
      shrink_value = 5.0 / (max + min_range)
      { 'scale_min'    => 0,
        'scale_max'    => max - min,
        'min_range'    => min_range,
        'min'          => min,
        'max'          => max,
        'shrink_value' => shrink_value }
    end
  end
end

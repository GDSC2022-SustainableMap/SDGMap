# frozen_string_literal: true

module Views
  # View for a single info entity
  class StatInfos
    def initialize(filtered_info)
      @info = filtered_info
    end

    def entity
      @info
    end

    def wifi_mean
      arr = @info.map(&:wifi).map(&:to_f)
      (arr.reduce(:+) / arr.size.to_f).round(1)
    end

    def seat_mean
      arr = @info.map(&:seat).map(&:to_f)
      (arr.reduce(:+) / arr.size.to_f).round(1)
    end

    def tasty_mean
      arr = @info.map(&:tasty).map(&:to_f)
      (arr.reduce(:+) / arr.size.to_f).round(1)
    end

    def cheap_mean
      arr = @info.map(&:cheap).map(&:to_f)
      (arr.reduce(:+) / arr.size.to_f).round(1)
    end

    def music_mean
      arr = @info.map(&:music).map(&:to_f)
      (arr.reduce(:+) / arr.size.to_f).round(1)
    end

    def quiet_mean
      arr = @info.map(&:quiet).map(&:to_f)
      (arr.reduce(:+) / arr.size.to_f).round(1)
    end
  end
end

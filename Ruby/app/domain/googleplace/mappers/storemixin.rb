# frozen_string_literal: true

# Using mixin to avoid rubocop show "Too many method inside a class"
module StoreMixin
  # Infos about  rank
  def place_id
    @data['place_id']
  end

  def name
    @data['name']
  end

  def formatted_address
    @data['formatted_address']
  end

  def location_lat
    @data['geometry']['location']['lat']
  end

  def location_lng
    @data['geometry']['location']['lng']
  end

  def rating
    @data['rating']
  end

  def user_ratings_total
    @data['user_ratings_total']
  end
end

# frozen_string_literal: true

require 'roda'
require 'slim/include'
require 'descriptive_statistics'

module CafeMap
  # Web App
  class App < Roda
    plugin :render, engine: 'slim', views: 'app/presentation/views_html'
    plugin :public, root: 'app/presentation/public'
    plugin :assets, path: 'app/presentation/assets', css: 'style.css', js: 'table_row.js'
    plugin :common_logger, $stderr
    plugin :halt
    plugin :all_verbs
    plugin :status_handler
    plugin :flash

    # use Rack::MethodOverride # allows HTTP verbs beyond GET/POST (e.g., DELETE)

    status_handler(404) do
      view('404')
    end

    route do |routing|
      # routing.assets # load CSS
      response['Content-Type'] = 'text/html; charset=utf-8'

      # routing.public # ?

      # GET /
      routing.root do
        session[:city] ||= []

        # Load previously viewed location
        cities = Repository::For.klass(Entity::Info).find_all_city
        session[:city] = cities.map(&:city)
        flash.now[:notice] = 'Add a city name to get started' if cities.none?

        # add our view_objects?

        view 'home'
      end

      routing.on 'region' do
        routing.is do
          # POST /region/
          routing.post do
            @user_wordterm = routing.params['The regional keyword you want to search (hsinchu)']
            unless @user_wordterm &&
                   Views::CityNames.new(@user_wordterm).legal_city?
              flash[:error] = 'Empty city name filled in'
              routing.halt 404
              routing.redirect '/'
            end

            # get info from cafenomad

            begin
              infos_data = CafeMap::CafeNomad::InfoMapper.new(App.config.CAFE_TOKEN).load_several
              filtered_infos_data = infos_data.select { |filter| filter.address.include? @user_wordterm }.shuffle
            rescue StandardError
              flash[:error] = 'Could not find that city in cafenomad'
              routing.redirect '/'
            end

            @lock = 1
            info = filtered_infos_data[0..@lock] # Random Entities Array
            session[:city].insert(0, info[1]).uniq!
            info_allname = Repository::For.klass(Entity::Info).all_name
            info_unrecorded = info.reject { |each_info| info_allname.include? each_info.name } # entities not in db

            # Add project to database
            info_unrecorded.each do |each_unrecorded|
              begin
                Repository::For.entity(each_unrecorded).create(each_unrecorded)
              rescue StandardError => e
                routing.redirect '/'
                flash[:error] = 'Having trouble accessing the info database'
              end

              begin
                place_entity = CafeMap::Place::StoreMapper.new(App.config.PLACE_TOKEN,
                                                               [each_unrecorded.name]).load_several
                Repository::For.entity(place_entity[0]).create(place_entity[0], each_unrecorded.name)
              rescue StandardError => e
                routing.redirect '/'
                flash[:error] = 'Having trouble accessing the store database'
              end

              begin
                last_infoid = Repository::For.klass(Entity::Info).last_id
                last_store = Repository::For.klass(Entity::Store).last
                last_store.update(info_id: last_infoid)
              rescue StandardError => e
                routing.redirect '/'
                flash[:error] = 'Having trouble making relation'
              end
            end
            routing.redirect "region/#{info[0].city}"
          end
        end

        routing.on String do |city|
          routing.delete do
            session[:city].delete(city)
          end

          # GET /cafe/region
          routing.get do
            begin
              filtered_info = CafeMap::Database::InfoOrm.where(city:).all
              if filtered_info.nil?
                flash[:error] = 'There is no cafe shop in the region'
                routing.redirect '/'
              end
            rescue StandardError => e
              flash[:error] = "Having trouble accessing database: error type: #{e}"
              routing.redirect '/'
            end

            ip = CafeMap::UserIp::Api.new.ip
            # Get Obj array
            google_data = filtered_info.map(&:store)

            # Get Value object
            infostat = Views::StatInfos.new(filtered_info)
            storestat = Views::StatStores.new(google_data)

            view 'region', locals: { infostat:,
                                     storestat:,
                                     ip: }

          rescue StandardError => e
            puts e.full_message
          end
        end
      end

      routing.on 'map' do
        routing.get do
          infos_data = CafeMap::Database::InfoOrm.all
          # puts infos_data.map(&:wifi)
          ip = CafeMap::UserIp::Api.new.ip
          location = CafeMap::UserIp::Api.new.to_geoloc
          $temp = []
          view 'map', locals: { info: infos_data,
                                ip:,
                                your_lat: location[0],
                                your_long: location[1],
                                uni_temp: $temp }
        end
      end
    end
  end
end

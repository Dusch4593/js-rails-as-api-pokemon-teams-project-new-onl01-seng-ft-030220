class PokemonsController < ApplicationController
  def index
    @pokemons = Pokemon.all
    render json: @pokemons
  end

  def show
    @pokemon = Pokemon.find_by(id: params[:id])

    render json: @pokemon
  end

  def create
    @pokemon = Pokemon.create(nickname: Faker::Name.first_name, species: Faker::Games::Pokemon.name, trainer_id: params[:trainerID].to_i)
    render json: @pokemon
  end
  def destroy
    @pokemon = Pokemon.find_by(id: params[:id])
    @pokemon.destroy
  end

  private
  def pokemon_params
    params.require(:pokemon).permit(:id, :species, :nickname, :trainer_id)
  end

end

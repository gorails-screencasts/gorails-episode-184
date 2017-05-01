class Team < ApplicationRecord
  has_many :players, dependent: :destroy

  accepts_nested_attributes_for :players, allow_destroy: true
end

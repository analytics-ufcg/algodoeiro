app.controller("MainController", function($scope){
		$scope.mensagem = "Mensagem de boas vindas";
		$scope.nome = "";



		$scope.selectedPerson = 0;
		$scope.selectedGenre = null;
		$scope.newPerson = null;
		$scope.addNew = function(){
			if ($scope.newPerson != null && $scope.newPerson != ""){
				$scope.people.push({
					id: $scope.people.length,
					name: $scope.newPerson,
					live:true,
					music: []
				})
			}
		}
		$scope.people = [
			{
				id: 0,
				name: 'León',
				music: [
					'Rock',
					'Metal',
					'Dubstep',
					'Electro'
				],
				live: true

			},
			{
				id: 1,
				name: 'Chris',
				music: [
					'Indie',
					'Drumstep',
					'Dubstep',
					'Electro'
				],
				live: true

			},
			{
				id: 2,
				name: 'Harry',
				music: [
					'Rock',
					'Metal',
					'Thrash Metal',
					'Heavy Metal'
				],
				live: false
			},
			{
				id: 3,
				name: 'Á	llyce',
				music: [
					'Pop',
					'RnB',
					'Hip Hop'
				],
				live: false
			}
		];
});
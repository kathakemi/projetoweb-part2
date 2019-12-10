			var titulo_publica = document.querySelector("#titulo_publica");
			var publica = document.querySelector("#publica");
			var musicas = document.querySelector("#musicas");
			var search = document.querySelector("#search");

			var carregando = '<center><img src="/loading.svg" /></center>';

			function JSONtoHTML_musicas(json_musicas)
			{
				var html_musicas = "";
				for (var i in json_musicas) {
				  html_musicas += '<div class="imageCenter"> \
						                <div class="imageCenterQuadrado"> \
						                    <div class="imageCenterText"> \
						                        <div class="imageCenterTextTitle">' + json_musicas[i].texto + '</div> \
						                        <div class="imageCenterTextDescription">' + json_musicas[i].author + '</div> \
						                    </div> \
						                </div> \
						                <div class="imageCenterQuadrado"> \
						                    <img src="/uploads/' + json_musicas[i].imagem + '" height="300px" width="100%"></img> \
						                </div>\
						            </div>';
				}
				return html_musicas;
			}

			publica.addEventListener("click", function(){
				musicas.innerHTML = carregando;
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.open("POST", "publica", true);
				xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState === 4 && xmlhttp.status === 200)
					{	
						musicas.innerHTML = JSONtoHTML_musicas(JSON.parse(xmlhttp.responseText));
						search.value = "";
					}
				};
				xmlhttp.send("titulo_publica=" + titulo_publica.value);
			});
			
			setInterval(function(){
				if (search.value == "")
				{
					musicas.innerHTML = carregando;
					var xmlhttp = new XMLHttpRequest();
					xmlhttp.open("GET", "musicas", true);
					xmlhttp.onreadystatechange = function() {
						if (xmlhttp.readyState === 4 && xmlhttp.status === 200)
						{	
							musicas.innerHTML = JSONtoHTML_musicas(JSON.parse(xmlhttp.responseText));
						}
					};
					xmlhttp.send();
				}
			}, 10000);

			search.addEventListener("keyup", function live_search() {
				musicas.innerHTML = carregando;
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.open("POST", "pesquisa", true);
				xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState === 4 && xmlhttp.status === 200)
					{	
						musicas.innerHTML = JSONtoHTML_musicas(JSON.parse(xmlhttp.responseText));
					}
				};
				xmlhttp.send("search=" + search.value);
			});
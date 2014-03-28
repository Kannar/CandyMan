
function nom()  {

$('.LesNoms').animate({ y: '1300px' },  { duration: 30000 });

}

function Pop()   {
								$('#ButtonStart').delay(500);
								$('#Titre').transition({ y: '900px' })
								$('#ButtonStart').delay(750);
								$('#ButtonStart').transition({ x: '-2000px' })
								$('#ButtonStart').transition({ scale:0.9} );
								$('#ButtonStart').delay(10);
								$('#ButtonStart').transition({ scale:1.0} );



}


$(document).ready(function() {
      nom();
      Pop();
});

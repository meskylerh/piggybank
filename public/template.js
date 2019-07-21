var count = 0;

function addItem() {
    $('#accordionEx .collapse').collapse('hide');
    $('#accordionEx').append($(`
<div class="card">
	<!-- Card header -->
	<div class="card-header" role="tab" id="heading${count}">
		<a data-toggle="collapse" data-parent="#accordionEx" href="#collapse${count}" aria-expanded="true" aria-controls="collapse${count}">
			<h5 class="mb-0">Vehicle #${count+1}</h5>
		</a>
	</div>

	<!-- Card body -->
	<div id="collapse${count}" class="collapse show" role="tabpanel" aria-labelledby="heading${count}" data-parent="#accordionEx">
		<div class="card-body">
			<div class="form-group">
				<label>Make</label>
				<input class="form-control" name="make${count}" type="text" required></input>
			</div>
			<div class="form-group">
				<label>Model</label>
				<input class="form-control" name="model${count}" type="text" required></input>
			</div>
			<div class="form-group">
				<label>Year</label>
				<input class="form-control" name="year${count}" type="number" min="1970" max="2020" required></input>
			</div>
			<div class="form-group">
				<label>Value</label>
				<div class="input-group">
					<div class="input-group-prepend">
						<span class="input-group-text">$</span>
					</div>
					<input class="form-control" name="value${count}" type="number" required></input>
				</div>
			</div>
			<div class="form-group">
				<label>Vin #</label>
				<input class="form-control" name="vin${count}" type="text" maxlength="17" required></input>
			</div>
		</div>
	</div>
</div>
`));
	$("html, body").animate({ scrollTop: $(document).height() }, 1000);
    ++count;
	document.forms[0]['collateral_count'].value=count;
}
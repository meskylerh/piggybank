var count = 1;

function addItem() {
    var newItem = document.createElement('div');
    newItem.innerHTML = `

    <!-- Card header -->
    <div class="card-header" role="tab" id="heading${count}">
      <a data-toggle="collapse" data-parent="#accordionEx" href="#collapse${count}" aria-expanded="true"
        aria-controls="collapse${count}">
        <h5 class="mb-0">
          Vehicle #${count}
        </h5>
      </a>
    </div>

    <!-- Card body -->
    <div id="collapse${count}" class="collapse show" role="tabpanel" aria-labelledby="heading${count}"
      data-parent="#accordionEx">
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
`;
    newItem.classList.add("card");
    $('#accordionEx .collapse').collapse('hide');
    document.getElementById('accordionEx').appendChild(newItem);
    ++count;
}
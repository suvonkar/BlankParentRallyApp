Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        this._loadData();
    },
    
    _loadData: function(){
        console.log("Inside dataload");
        var filter = [ {
			property : 'State',
			operator : '=',
			value : 'Open'
		} ,
		{
			property : 'Parent',
			operator : '!=',
			value : null
		} 
		];
	 var myStore = Ext.create("Rally.data.wsapi.Store", {
            model: 'Project',
            autoLoad: true,
            listeners: {
                load: function(myStore, myData, success) {
                    //console.log("my store is ", myStore);
                    //console.log("my data is ", myData);
                    this._createCustomStore(myData);
                },
                scope: this
            },
            fetch: ['ObjectID','Name', 'Parent', 'State', 'Description', 'Children'],
            filters : filter
        });
    },
    
    _createCustomStore:function(myData){
        var noParentDataArr = [];
        Ext.each(myData, function(data, index) {
          if(data.data.Parent !== null && data.data.Parent !== ""){
              //console.log('Parent Found for Project : ' + data.data.Name);
          }else{
              noParentDataArr.push(data);
          }
        });
        //console.log("Data Array Created : " , noParentDataArr);
        
        var noParentDataColl = new Ext.util.MixedCollection();
        noParentDataColl.addAll(noParentDataArr);
        //console.log("Mixed Collection Created : " , noParentDataColl);
        
        
        var customStore = Ext.create('Rally.data.custom.Store', {
                                model: 'Project',
                                data: noParentDataArr
                            }); 
        
        console.log("Custome Store Created : " , customStore);
        
        this._loadDataGrid(customStore);
    },
    
    _loadDataGrid:function(myDataStore){
        var myGrid = Ext.create('Rally.ui.grid.Grid', {
            store: myDataStore,
            columnCfgs: [
                {
                    text:'ObjectID', 
                    dataIndex:"ObjectID",
                    width: 200,
                    resizeable: true
                },
                {
                    text:'Name', 
                    dataIndex:"Name",
                    width: 300,
                    resizeable: true
                },
                {
                    text:'Description', 
                    dataIndex:"Description",
                    width: 300,
                    resizeable: true
                }
            ]
         });
         this.add(myGrid);
    }
});

/*!
 * jQuery lightweight resizable plug-in
 * Author: @0mbre
 * Licensed under the MIT license
 */

;(function( factory ) {
    if ( typeof exports === 'object' ) {
        module.exports = factory( this.jQuery || require('jquery') );
    } else if ( typeof define === 'function' && define.amd ) {
        define([ 'jquery' ], function ($ ) {
            return factory( $ );
        });
    } else {
        this.ResizeThis = factory( this.jQuery );
    }

})(function( $ ) {
    // test for CSS property suport
    var _supports = function( property ) {
        var prefixes = [ 'Webkit', 'Moz', 'O' ];
        var supported = false;

        // Capitalize Property
        var Property = property.replace( /^./, function (match) {
            return match.toUpperCase();
        });

        // Try Vendors prefixes
        for ( var i in prefixes ) {
            supported = supported | prefixes[i] + Property in document.body.style;
        }

        // Try standard
        supported = supported | property in document.body.style;

        return supported;
    }

    var defaults = {
        propertyName: "value",
        handles: "se"
    };

    function ResizeThis( element, options ) {
        this.el = this._instance = element;
        this.$el = $( element );

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;

        this.init();
    }

    ResizeThis.prototype.init = function () {
        this._supported = _supports( 'resize' );

        // @TODO should leverage CSS Resize whenever possible
        this._supported && this.$el.addClass( 'rt-resizable' );

        // Inset Handles
        this._insertHandles();

        // Register event
        //$( document ).on( 'mousedown.rtClick', '.rt-handle', $.proxy(this._mouseStart, this) );
    };

    ResizeThis.prototype._insertHandles = function () {
            this.handles = this.options.handles;

			if ( this.handles === "all") {
				this.handles = "n,e,s,w,se,sw,ne,nw";
			}

			var n = this.handles.split(",");
			this.handles = {};

			for( var i = 0; i < n.length; i++ ) {
				var handle = $.trim( n[i] );
				var $handle = $( "<div class='rt-handle'></div>" );
				$handle.css({ zIndex: 2999 });
                $handle.on( 'mousedown.rtClick', $.proxy(this._mouseStart, this) );
				this.$el.append( $handle );
			}
    }

    ResizeThis.prototype._mouseStart = function ( evt ) {
        var width = this.$el.innerWidth();
        var height = this.$el.innerHeight();
        $( document ).on( 'mousemove.rtMove', $.proxy(this._mouseDrag, this) );
        $( document ).on( 'mouseup.rtClick', $.proxy(this._mouseStop, this) );
        this._instance._startPos = {
            x: evt.pageX,
            y: evt.pageY,
        }

        this._instance._startSize = {
            x: width,
            y: height
        }
    }

    ResizeThis.prototype._mouseStop = function ( evt ) {
        $( document ).off( 'mousemove.rtMove' );
    }

    ResizeThis.prototype._mouseDrag = function( evt ) {
         var XY = {
            x: evt.pageX - this._instance._startPos.x,
            y: evt.pageY - this._instance._startPos.y
        }
         this._resize( XY );
        console.log('mouse drag', XY);

    }

    ResizeThis.prototype._resize = function( XY ) {
        var sX = this._instance._startSize.x;
        var sY = this._instance._startSize.y;

        this.$el.css({
            width: sX + XY.x,
            height: sY + XY.y
        })
    }

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn.resizeThis = function ( options ) {
        return this.each(function () {
            new ResizeThis( this, options );
        });
    }

})


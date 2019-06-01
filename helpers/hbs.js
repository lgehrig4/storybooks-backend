const moment = require('moment');

module.exports = {
  // Truncate story in the card view to limit characters
  truncate: function(str, len) {
    if (str.length > len && str.length > 0) {
      var new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
      return new_str + '...';
    }
    return str
  },
  // Removes HTML tags
  stripTags: function(input) {
    return input.replace(/<(?:.|\n)*?>/gm, '');
  },
  // Format Date
  formatDate: function(date, format) {
    return moment(date).format(format);
  },
  // Displays the selected form values for edit page
  select: function(selected, options) {
    return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
  },
  // Edit icon
  editIcon: function(storyUser, loggedUser, storyId, floating = true) {
    if (storyUser == loggedUser) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab waves-effect red">
        <i class="fas fa-pencil-alt"></i></a>`;
      } else {
          return `<a href="/stories/edit/${storyId}"><i class="fas fa-pencil-alt"></i></a>`;
      }
    } else {
      return '';
    }
  }
}

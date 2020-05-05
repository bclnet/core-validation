using System.Collections.Generic;

namespace CoreValidation.Bindings
{
  public abstract class AbstractBinding
  {
    public abstract IDictionary<string, object> GetState(object source, object opts);
    public abstract void SetState(object source, object opts, IDictionary<string, object> values);
    public abstract IDictionary<string, object> GetErrors(object source);
    public abstract void SetErrors(object source, IDictionary<string, object> errors);
  }
}
